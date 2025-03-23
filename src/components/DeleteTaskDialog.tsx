import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteTaskDialog({
  id,
  onDelete,
  className,
}: {
  id: string;
  onDelete: (id: string) => void;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant="destructive">
          Delete Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="destructive" onClick={() => onDelete(id)}>
              Yes, Delete
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
