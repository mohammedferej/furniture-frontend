"use client";

import { AuthService } from "@/lib/AuthService";
import { format } from "date-fns";
import { Activity, AlertCircle, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const fetchUsers = async () => {
    const data = await AuthService.getUsersPaginated(1);
    setUsers(data.results);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // const handleLogout = async () => {
  //   await AuthService.logout();
  //   router.push("/login");
  // };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Chart data
  const chartData = [
    { date: "2025-07-03", signups: 5 },
    { date: "2025-07-04", signups: 8 },
    { date: "2025-07-05", signups: 12 },
    { date: "2025-07-06", signups: 7 },
    { date: "2025-07-07", signups: 15 },
    { date: "2025-07-08", signups: 10 },
    { date: "2025-07-09", signups: 6 },
  ];

  const topActiveUsers = users.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Stats Grid */}
      <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={users.length.toString()}
          variant="primary"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="New Signups"
          value="24"
          variant="success"
          icon={<UserPlus className="h-6 w-6" />}
        />
        <StatCard
          title="Active Now"
          value="12"
          variant="warning"
          icon={<Activity className="h-6 w-6" />}
        />
        <StatCard
          title="Issues"
          value="3"
          variant="danger"
          icon={<AlertCircle className="h-6 w-6" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6">
        {/* Chart Card */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg">
              User Signups (Past 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MMM dd")}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    labelFormatter={(date) =>
                      format(new Date(date), "MMM dd, yyyy")
                    }
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="signups"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Signup Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.slice(0, 5).map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.username}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.created_at
                            ? format(new Date(user.created_at), "MMM dd, yyyy")
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top Active Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              {topActiveUsers.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {topActiveUsers.map((user) => (
                    <li key={user.id} className="py-3">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.username}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No active users found.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
