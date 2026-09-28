import fs from "fs";
import path from "path";

const srcPath = path.resolve("components/comunidad/tabs/AdminPanel.tsx");
const destPath = path.resolve("components/admin/legacy-tabs.tsx");

const src = fs.readFileSync(srcPath, "utf8");
const lines = src.split(/\n/);

// 1-indexed inclusive ranges to KEEP from the original AdminPanel
const ranges = [
  [205, 547],   // constants + AdminAsesorias
  [548, 655],   // AdminSupport
  [1076, 1178], // AdminAbandonedCarts
  [1966, 2090], // AdminExportCsv
  [2091, 2221], // AdminImport
  [2222, 2260], // AdminPlans
  [2261, 2429], // AdminSchedules
  [2430, 2472], // AdminSettings
  [2473, 2986], // AdminPopups
  [2987, 3614], // AdminPrices
  [3615, 4664], // Newsletter
  [4665, 5499], // AdminDiplomas
  [5500, 6077], // AdminCompanies
  [6078, lines.length], // AdminLiveClasses
];

const body = ranges
  .map(([from, to]) => lines.slice(from - 1, to).join("\n"))
  .join("\n\n");

const exported = body.replace(
  /^function (AdminAsesorias|AdminSupport|AdminAbandonedCarts|AdminExportCsv|AdminImport|AdminPlans|AdminSchedules|AdminSettings|AdminPopups|AdminPrices|AdminNewsletter|AdminDiplomas|AdminCompanies|AdminLiveClasses)\(/gm,
  "export function $1("
);

const header = `"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Users, Building, CreditCard, Settings, Plus, TrendingUp, Search, MoreHorizontal,
  ShieldCheck, Loader2, Activity, DollarSign, MessageSquare, ArrowUpRight, ArrowDownRight,
  Eye, EyeOff, Ban, Mail, UserPlus, BarChart3, Palette, GraduationCap, Upload, Download,
  ChevronLeft, ChevronRight, Trash2, X, CheckCircle, AlertCircle, Globe, Lock, Play,
  FileText, Video, Megaphone, Sparkles, Tag, ArrowRight, Bell, Percent, ShoppingCart,
  Newspaper, Star, ExternalLink, Edit3, Code, Award, Briefcase, Share2, Calendar, Radio,
  Film, Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminUpdateUserSubscription } from "@/lib/supabase/comunidad";
import {
  adminGetCourses, adminGetAllUsers, adminDeleteUser, adminBulkDeleteUsers,
  adminGetUserEnrollments, adminEnrollUser, adminRemoveEnrollment, adminUpdateUserRole,
  adminBulkImport, adminGetExportData, getAllPublishedCourses, adminGetDashboardStats,
  adminGetLeads, adminDeleteLead, adminBulkDeleteLeads, adminGetSchedules, adminAddSchedule,
  adminDeleteSchedule, adminToggleScheduleActive, adminGetPopups, adminCreatePopup,
  adminUpdatePopup, adminTogglePopup, adminDeletePopup, adminGetPromotions, adminCreatePromotion,
  adminTogglePromotion, adminDeletePromotion, adminGetPriceOverrides, adminUpsertPriceOverride,
  adminGetArticles, adminCreateArticle, adminUpdateArticle, adminDeleteArticle,
  adminToggleArticlePublish, adminToggleArticleFeatured, adminGetNewsletterCategories,
  adminCreateNewsletterCategory, adminUpdateNewsletterCategory, adminDeleteNewsletterCategory,
  adminToggleNewsletterCategory, adminGetCoupons, adminCreateCoupon, adminUpdateCoupon,
  adminToggleCoupon, adminDeleteCoupon, adminGetCertificates, adminAddCertificate,
  adminImportCertificates, adminDeleteCertificate,
} from "@/lib/supabase/comunidad-ai";
import { courses as allCourses } from "@/lib/data/courses";
import { communityPlans } from "@/lib/data/community_plans";
import ArticleBlockEditor from "@/components/shared/ArticleBlockEditor";
import PricingExperimentCard from "@/components/comunidad/tabs/admin/PricingExperimentCard";
import { HoldToDeleteButton } from "@/components/admin/HoldToDeleteButton";
import {
  formatRegistrationSource,
} from "@/lib/registration-source";

`;

fs.mkdirSync(path.dirname(destPath), { recursive: true });
fs.writeFileSync(destPath, header + exported + "\n");
console.log("wrote", destPath, "lines", (header + exported).split("\n").length);
