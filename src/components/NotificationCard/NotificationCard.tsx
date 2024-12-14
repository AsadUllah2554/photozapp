import { defaultProfileImage } from "@/common/common";
import { Avatar, Card } from "antd";


export default function NotificationCard() {
  return (
    <Card title="Notifications" className="mb-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <Avatar className="mr-4" 
            src={defaultProfileImage}
          />
          <div>
            <p className="font-bold">Asad</p>
            <p className="text-gray-600">Commented on your post</p>
          </div>
        </div>
        <div className="flex items-center">
          <Avatar className="mr-4" 
           src={defaultProfileImage}
          />
          <div>
            <p className="font-bold">Ali</p>
            <p className="text-gray-600">Commented on your post</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
