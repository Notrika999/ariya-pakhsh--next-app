import React from "react";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";

/**
 * @param {{
 *   label: React.ReactNode;
 *   value: React.ReactNode;
 *   icon?: React.ReactNode;
 *   iconClassName?: string;
 *   valueClassName?: string;
 *   id?: string;
 * }} props
 */
export function UserProfileTopStat({
  label,
  value,
  icon,
  iconClassName = "bg-primary",
  valueClassName = "text-lg font-bold text-gray-800 dark:text-gray-200",
  id,
}) {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div id={id} className={valueClassName}>
          {value}
        </div>
      </div>
      {icon ? (
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${iconClassName}`}
        >
          {icon}
        </div>
      ) : null}
    </div>
  );
}

/**
 * @param {{
 *   title: string;
 *   description?: React.ReactNode;
 *   titleTag?: boolean;
 *   children?: React.ReactNode;
 *   aside?: React.ReactNode;
 *   className?: string;
 *   contentClassName?: string;
 *   wrapped?: boolean;
 * }} props
 */
export default function UserProfileTop({
  title,
  description,
  titleTag,
  children = null,
  aside = null,
  className = "",
  contentClassName = "",
  wrapped = true,
}) {
  const content = (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between ${contentClassName}`}
    >
      <div>
        <TitleAfter title={title} tag={titleTag} />
        {description ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        ) : null}
        {children}
      </div>

      {aside ? <div className="mt-4 md:mt-0">{aside}</div> : null}
    </div>
  );

  if (!wrapped) return content;

  return (
    <div
      className={`rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark ${className}`}
    >
      {content}
    </div>
  );
}
