import { AppLayout } from "@/components/AppLayout";
import { FeedbackProvider } from "@/components/feedback/FeedbackProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <FeedbackProvider>
        <AppLayout>{children}</AppLayout>
      </FeedbackProvider>
    </ProtectedRoute>
  );
}
