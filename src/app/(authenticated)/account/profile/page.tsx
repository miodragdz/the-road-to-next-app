import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { AccountTabs } from "@/features/account/components/account-tabs";
import { UserUpdateForm } from "@/features/account/components/update-user-form";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

const ProfilePage = async () => {
  const { user: authUser } = await getAuthOrRedirect();

  return (
    <div className="flex-1 flex flex-col gap-y-8 pl-8">
      <Heading
        title="Profile"
        description="All your profile information"
        tabs={<AccountTabs />}
      />
      <div className="flex-1 flex flex-col justify-center items-center">
        <CardCompact
          title="Update user data"
          description=""
          className="w-full max-w-105 animate-fade-from-top"
          content={<UserUpdateForm user={authUser} />}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
