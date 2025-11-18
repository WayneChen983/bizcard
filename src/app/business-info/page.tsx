
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { ChevronLeft, Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BusinessInfoPage = () => {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('nav_business_info')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜尋商業活動、產業關鍵字"
            className="pl-10"
          />
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>BNext Summit 2024 | 數位新商業論壇</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    <li>活動日期：2024年4月25日 (四)</li>
                    <li>地點：台北 (詳細場地請參考官方網站)</li>
                    <li>主辦單位：數位時代 (BNext Media)</li>
                    <li>活動概要：以「科技開創美好新價值」為主題，聚焦數位轉型、創新商模與新世代品牌策略。論壇將邀集企業領袖、新創團隊及產業專家，共同探討 AI、Web3、永續發展等科技如何形塑未来商業格局。</li>
                </ul>
            </CardContent>
            <div className="p-6 pt-0">
                <div className="relative aspect-video w-full">
                    <Image
                      src="https://picsum.photos/seed/bnext/600/338"
                      alt="BNext Summit"
                      fill
                      className="rounded-md object-cover"
                      data-ai-hint="business conference"
                    />
                </div>
            </div>
            <CardFooter className="flex justify-stretch gap-4">
                <Button variant="outline" className="w-full">查看詳情</Button>
                <Button className="w-full">儲存此活動</Button>
            </CardFooter>
        </Card>

      </main>
    </div>
  );
};

export default BusinessInfoPage;
