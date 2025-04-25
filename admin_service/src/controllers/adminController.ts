import { Request, Response } from "express";
import CustomError from "../utils/CustomError";
import { publishToQueue } from "../utils/rabbitmq/rabbitmqPublish";
import { users } from "../consumers/userConsumer";
import userProgressCache from "../consumers/progressData";
import bulkUsersCache from "../consumers/bulkUsersData";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const adminDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new CustomError("User ID is required", 400);
  }

  await publishToQueue("allUserDetails", userId);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const allUsers = Array.from(users.values());
  const filteredUsers = allUsers.filter(user => user.role === "student");


  if (!filteredUsers.length) {
    return res.status(404).json({ message: "No users found." });
  }

  //UserRegistration Details

  const now = new Date();

  const dayStats = new Map<string, number>();
  const weekStats = new Map<string, number>();
  const monthStats = new Map<string, number>();
  const yearStats = new Map<string, number>();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  filteredUsers.forEach((user) => {
    const createdAt = new Date(user.createdAt);

    // DAY: group by hour
    if (createdAt.toDateString() === now.toDateString()) {
      const hour = createdAt.getHours();
      const label = `${hour % 12 === 0 ? 12 : hour % 12}${
        hour < 12 ? "AM" : "PM"
      }`;
      dayStats.set(label, (dayStats.get(label) || 0) + 1);
    }

    // WEEK: group by day name
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    if (createdAt >= startOfWeek && createdAt < endOfWeek) {
      const day = daysOfWeek[createdAt.getDay()];
      weekStats.set(day, (weekStats.get(day) || 0) + 1);
    }

    // MONTH: group by week number (Week 1 to Week 4)
    if (
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    ) {
      const weekNumber = Math.floor((createdAt.getDate() - 1) / 7) + 1;
      const label = `Week ${weekNumber}`;
      monthStats.set(label, (monthStats.get(label) || 0) + 1);
    }

    // YEAR: group by month name
    if (createdAt.getFullYear() === now.getFullYear()) {
      const month = monthsOfYear[createdAt.getMonth()];
      yearStats.set(month, (yearStats.get(month) || 0) + 1);
    }
  });

  const formatStats = (map: Map<string, number>) =>
    Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0])) // sort alphabetically or by time
      .map(([date, count]) => ({ date, count }));

  const graphData = {
    day: formatStats(dayStats),
    week: formatStats(weekStats),
    month: formatStats(monthStats),
    year: formatStats(yearStats),
  };

  //Students count

  const studentCategory = {
    total: filteredUsers.length,
    first: 0,
    second: 0,
    third: 0,
  };

  filteredUsers.forEach((user) => {
    const age = user?.age;

    if (typeof age === "number") {
      if (age >= 13) {
        studentCategory.third += 1;
      } else if (age >= 9) {
        studentCategory.second += 1;
      } else if (age >= 5) {
        studentCategory.first += 1;
      }
    }
  });

  return res.status(200).json({
    success: true,
    message: "catagoriesed the data ",
    studentsCountData: studentCategory,
    userRegistrationData: graphData,
  });
};
export const getTopPerfomingStudents = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const limit = Number(req.query.limit) || 10;

  // Step 1: Request top performing users based on lessons completed
  await publishToQueue("userProgress", limit);

  // Wait for userProgressData to arrive in cache
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Step 2: Extract user progress from the cache
  const UsersProgressData: any[] = Array.from(userProgressCache.values());

  if (!UsersProgressData.length) {
    return res.status(404).json({ message: "No user progress found." });
  }

  const userProgressList = UsersProgressData.flatMap((d: any) => d.userProgress || []);
  const userIds = userProgressList.map((up: any) => up.userId);

  // Step 3: Request full user details for those top users
  await publishToQueue("fetchBulkUserDetails", { userIds });

  // Wait for user data to be populated in cache
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Step 4: Map userId to user data
  const UsersDetailsMap = new Map(userIds.map((id) => [id, bulkUsersCache.get(id)]));

  // Step 5: Merge user data with progress data
  const result = userProgressList.map((progress: any) => ({
    ...progress,
    user: UsersDetailsMap.get(progress.userId) || null,
  }));

  return res.status(200).json({
    message: "Fetched top performing students (by lessons completed)",
    data: result,
  });
};

