import { Skeleton } from "@prpr/ui/components/skeleton";

export default function Loading() {
  return (
    <div className=" col-span-12">
      <div className="p-2 md:p-10 flex flex-col gap-4 justify-center max-w-screen-lg mx-auto">
        <Skeleton className="h-20 w-10/12" />
        <Skeleton className="h-16 w-10/12 md:w-8/12" />
        <Skeleton className="h-14 w-9/12 md:w-7/12" />
        <Skeleton className="h-14 w-8/12 md:w-6/12" />
        <Skeleton className="h-12 w-8/12 md:w-6/12" />
      </div>
    </div>
  );
}
