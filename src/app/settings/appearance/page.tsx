
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

const themes = [
  { name: 'default', color: 'hsl(25, 95%, 53%)' },
  { name: 'rose', color: 'hsl(346.8, 90.1%, 60.2%)' },
  { name: 'green', color: 'hsl(142.1, 76.2%, 36.3%)' },
  { name: 'blue', color: 'hsl(221.2, 83.2%, 53.3%)' },
  { name: 'violet', color: 'hsl(262.1, 83.3%, 57.8%)' },
];

const AppearancePage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [themeMode, setThemeMode] = useState('system');
  const [colorTheme, setColorTheme] = useState('default');
  const [fontSize, setFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedThemeMode = localStorage.getItem('theme') || 'system';
    const storedColorTheme = localStorage.getItem('colorTheme') || 'default';
    const storedFontSize = localStorage.getItem('fontSize');
    
    setThemeMode(storedThemeMode);
    setColorTheme(storedColorTheme);

    if (storedFontSize) {
      const size = parseInt(storedFontSize, 10);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}px`;
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Handle dark/light mode
      if (
        themeMode === 'dark' ||
        (themeMode === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', themeMode);

      // Handle color theme
      document.body.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          document.body.classList.remove(className);
        }
      });
      document.body.classList.add(`theme-${colorTheme}`);
      localStorage.setItem('colorTheme', colorTheme);

    }
  }, [themeMode, colorTheme, mounted]);

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('fontSize', newSize.toString());
  };

  if (!mounted) {
    return null; // Avoid rendering until mounted on client
  }

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('appearance_title')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('theme_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={themeMode}
                onValueChange={setThemeMode}
                className="grid grid-cols-3 gap-4"
              >
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  <Sun className="mb-2 h-6 w-6" />
                  {t('theme_light')}
                </Label>
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Moon className="mb-2 h-6 w-6" />
                  {t('theme_dark')}
                </Label>
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem
                    value="system"
                    id="system"
                    className="sr-only"
                  />
                  <Monitor className="mb-2 h-6 w-6" />
                  {t('theme_system')}
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>色彩主題</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setColorTheme(theme.name)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                    colorTheme === theme.name ? 'border-primary' : 'border-transparent'
                  )}
                  aria-label={`Select ${theme.name} theme`}
                >
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.color }}
                  >
                    {colorTheme === theme.name && <Check className="h-5 w-5 text-white" />}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('font_size_title')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('font_size_small')}</span>
                    <span className="text-xl text-muted-foreground">{t('font_size_large')}</span>
                </div>
              <Slider
                min={12}
                max={20}
                step={1}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AppearancePage;
