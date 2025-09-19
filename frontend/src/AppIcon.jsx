// frontend/src/components/AppIcon.jsx
import React from "react";
import { CheckCircle, AlertTriangle, AlertCircle, Info, User, Clock } from "lucide-react";

const icons = {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  User,
  Clock,
};

const AppIcon = ({ name, size = 24, strokeWidth = 2, className = "" }) => {
  const Icon = icons[name] || Info;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
};

export default AppIcon;
