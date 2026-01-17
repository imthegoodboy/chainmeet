"use client";

import Link from "next/link";
import { Calendar, Clock, Users, Shield } from "lucide-react";

interface MeetingCardProps {
  meeting: {
    id: string;
    name: string;
    description: string;
    startTime: number;
    endTime: number;
    status: number;
    ruleType?: string;
  };
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Active";
      case 1:
        return "Ended";
      case 2:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800";
      case 1:
        return "bg-gray-100 text-gray-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{meeting.name}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
            meeting.status
          )}`}
        >
          {getStatusText(meeting.status)}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {meeting.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {formatDate(meeting.startTime)}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
        </div>
        {meeting.ruleType && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            {meeting.ruleType}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {meeting.status === 0 && (
          <Link
            href={`/meeting/${meeting.id}`}
            className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors text-center"
          >
            Join
          </Link>
        )}
        <Link
          href={`/meeting/${meeting.id}`}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}
