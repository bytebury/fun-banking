import { marked } from "marked";

export const formatDate = (date: Date | string, dateOptions?: any) => {
  dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...dateOptions,
  };
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("en-US", dateOptions).format(date);
};

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

export const formatMarkdown = (markdown: string): string => {
  marked.setOptions({ async: false, gfm: true, breaks: true });
  return marked(markdown) as string;
};

export const formatCurrency = (
  value: string | number,
  currency = "USD",
  locale = "en-US"
): string => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

export const formatNumber = (value: string | number): string => {
  if (typeof value === "string") {
    value = parseInt(value, 10);
  }
  return value?.toLocaleString() ?? 0;
};

export const formatKs = (value: string | number): string => {
  value = Number(value);

  if (value >= 1_000 && value < 1_000_000) {
    return (value / 1_000).toFixed(1) + "K";
  }
  return (value / 1_000_000).toFixed(1) + "M";
};

export const capitalize = (value: string): string => {
  if (!value?.trim()) {
    return "";
  }

  return value
    .split(" ")
    .map((value) => value.at(0)?.toUpperCase() + value.slice(1))
    .join(" ");
};
