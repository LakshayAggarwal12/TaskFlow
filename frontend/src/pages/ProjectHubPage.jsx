import { useParams, Link } from "react-router-dom";
import { Construction } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

export default function ProjectHubPage() {
  const { workspaceId } = useParams();

  return (
    <div className="max-w-2xl mx-auto py-16">
      <EmptyState
        icon={Construction}
        title="Boards are coming in the next module"
        description="This project was created successfully — the Board, Sprints, and Analytics views are the next piece of the build."
        action={
          <Link to={`/w/${workspaceId}`}>
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}
