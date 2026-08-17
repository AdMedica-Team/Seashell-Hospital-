import { AntiFraudBar } from "@/components/layout/AntiFraudBar";
import { TopBar } from "@/components/layout/TopBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Chatbot } from "@/components/site/Chatbot";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export default function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <>
      <AntiFraudBar />
      <TopBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <Chatbot />
    </>
  );
}
