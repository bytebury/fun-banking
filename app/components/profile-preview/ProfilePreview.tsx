import Link from "next/link";

type ProfilePreviewProps = {
  className?: string;
  user: any;
};

export function ProfilePreview({ className, user }: ProfilePreviewProps) {
  return (
    <Link href={`/profile/${user.username}`}>
      {/*eslint-disable-next-line @next/next/no-img-element*/}
      <img
        className={`${className} rounded-full`}
        src={user.avatar}
        alt={`${user.username} profile image`}
      />
    </Link>
  );
}
