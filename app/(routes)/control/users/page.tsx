"use client";

import { Card } from "@/app/components/card/Card";
import { ProfilePreview } from "@/app/components/profile-preview/ProfilePreview";
import { formatDate } from "@/app/utils/formatters";
import { GET } from "@/app/utils/http-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersControlPage() {
  const [searchResults, setSearchResults] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await GET(`/users`);
      const users = await response.json();

      setSearchResults(users);
    };

    if (!searchResults) {
      fetchUsers();
    }
  }, [searchResults]);

  if (!searchResults) {
    return (
      <Card type="outlined" className="flex flex-col gap-4">
        <section>
          <h1>Search Users</h1>
          Loading...
        </section>
      </Card>
    );
  }

  return (
    <Card type="outlined" className="flex flex-col gap-4">
      <section>
        <h1>Search Users</h1>
        <div className="form-field">
          <input type="text" />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Name</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.items.map((item: any) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="flex gap-1 items-center">
                    <ProfilePreview className="w-4 h-4" user={item} />
                    <Link href={`/profile/${item.username}`}>{item.username}</Link>
                  </td>
                  <td>{item.email}</td>
                  <td>
                    {item.first_name} {item.last_name}
                  </td>
                  <td>{formatDate(item.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </Card>
  );
}
