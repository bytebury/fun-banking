"use client";

import { useState } from "react";
import { PreviewAnnouncement } from "./PreviewAnnouncement";
import { POST, PUT } from "@/app/utils/http-client";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { useRouter } from "next/navigation";

export function NewAnnouncementForm({
  title,
  description,
  action,
  id,
}: {
  title?: string;
  description?: string;
  id?: string | number;
  action?: "new" | "edit";
}) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ title, description });

  function handleChange(event: any): void {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value ?? "" }));
  }

  async function updateAnnouncement(event: any): Promise<void> {
    event.preventDefault();

    const payload = { ...formData, id };

    try {
      const response = await PUT(`/announcements/${id}`, payload);

      if (response.ok) {
        showSnackbar("Successfully updated your announcement");
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function publishAnnouncement(event: any): Promise<void> {
    event.preventDefault();

    if (action === "edit") {
      await updateAnnouncement(event);
      return;
    }

    const payload = formData;

    try {
      const response = await PUT(`/announcements`, payload);

      if (response.ok) {
        const announcement = await response.json();
        showSnackbar("Successfully published your announcement");
        router.push(`/announcements/${announcement.id}`);
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={publishAnnouncement}>
        <div className="form-field">
          <label htmlFor="announcement_title">Title</label>
          <input
            id="announcement_title"
            name="title"
            type="text"
            maxLength={50}
            autoComplete="off"
            onChange={handleChange}
            defaultValue={title}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="announcement_description">Description (Markdown)</label>
          <textarea
            id="announcement_description"
            name="description"
            className="h-[300px]"
            onChange={handleChange}
            defaultValue={description}
            required
          ></textarea>
        </div>
        <div className="flex gap-2">
          <input
            type="submit"
            value={`${action === "edit" ? "Update" : "Post"} Announcement`}
            className="common filled"
          />
          <input type="reset" value="Cancel" className="common ghost" />
        </div>
      </form>
      <hr />
      <PreviewAnnouncement title={formData.title} markdown={formData.description} />
    </>
  );
}
