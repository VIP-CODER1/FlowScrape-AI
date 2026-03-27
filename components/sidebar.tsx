'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import UserAvailableCreditsBadge from '@/components/user-available-credits-badge';

const routes = [
  {
    href: '',
    label: 'Home',
    icon: HomeIcon,
  },
  {
    href: 'workflows',
    label: 'Workflows',
    icon: Layers2Icon,
  },
  {
    href: 'credentials',
    label: 'Credentials',
    icon: ShieldCheckIcon,
  },
  {
    href: 'billing',
    label: 'Billing',
    icon: CoinsIcon,
  },
];

const sidebarSections = [
  {
    title: 'EMBEDDED AGENTS',
    items: [
      { label: 'AI Workflows', href: 'ai-workflows' },
      { label: 'MCP Servers', href: 'mcp-servers' },
    ],
  },
  {
    title: 'MAINTAIN',
    items: [
      { label: 'Logs', href: 'logs' },
      { label: 'Audit', href: 'audit' },
    ],
  },
  {
    title: 'MORE',
    items: [
      { label: 'Functions', href: 'functions' },
      { label: 'User Forms', href: 'user-forms' },
      { label: 'Data Refs', href: 'data-refs' },
      { label: 'Tables', href: 'tables' },
      { label: 'Try API', href: 'try-api' },
    ],
  },
];

function isLinkActive(pathname: string, href: string) {
  if (!href) return pathname === '/';
  return pathname === `/${href}` || pathname.startsWith(`/${href}/`);
}

export function DesktopSidebar() {
  const [isMaintainOpen, setIsMaintainOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const pathname = usePathname();
  const activeRoute = routes.find((route) => isLinkActive(pathname, route.href)) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-y-auto w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex-items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col p-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={`/${route.href}`}
            className={buttonVariants({
              variant: isLinkActive(pathname, route.href) ? 'sidebarActiveItem' : 'sidebarItem',
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>

      <div className="px-4 pb-4 space-y-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {section.title === 'MORE' || section.title === 'MAINTAIN' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (section.title === 'MORE') {
                      setIsMoreOpen((prev) => !prev);
                    } else {
                      setIsMaintainOpen((prev) => !prev);
                    }
                  }}
                  className="w-full flex items-center justify-between text-xs font-semibold tracking-wide text-muted-foreground/80 py-1"
                >
                  <span>{section.title}</span>
                  <ChevronDownIcon
                    size={14}
                    className={
                      (section.title === 'MORE' ? isMoreOpen : isMaintainOpen)
                        ? 'rotate-180 transition-transform'
                        : 'transition-transform'
                    }
                  />
                </button>
                {(section.title === 'MORE' ? isMoreOpen : isMaintainOpen) && (
                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={`/${item.href}`}
                        className={buttonVariants({
                          variant: isLinkActive(pathname, item.href) ? 'sidebarActiveItem' : 'sidebarItem',
                          className: 'w-full',
                        })}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground/80">{section.title}</p>
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${item.href}`}
                      className={buttonVariants({
                        variant: isLinkActive(pathname, item.href) ? 'sidebarActiveItem' : 'sidebarItem',
                        className: 'w-full',
                      })}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaintainOpen, setIsMaintainOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const pathname = usePathname();
  const activeRoute = routes.find((route) => isLinkActive(pathname, route.href)) || routes[0];

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] space-y-4" side="left">
            <Logo />
            <UserAvailableCreditsBadge />
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={`/${route.href}`}
                  className={buttonVariants({
                    variant: isLinkActive(pathname, route.href) ? 'sidebarActiveItem' : 'sidebarItem',
                  })}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 space-y-4">
              {sidebarSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  {section.title === 'MORE' || section.title === 'MAINTAIN' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (section.title === 'MORE') {
                            setIsMoreOpen((prev) => !prev);
                          } else {
                            setIsMaintainOpen((prev) => !prev);
                          }
                        }}
                        className="w-full flex items-center justify-between text-xs font-semibold tracking-wide text-muted-foreground/80 py-1"
                      >
                        <span>{section.title}</span>
                        <ChevronDownIcon
                          size={14}
                          className={
                            (section.title === 'MORE' ? isMoreOpen : isMaintainOpen)
                              ? 'rotate-180 transition-transform'
                              : 'transition-transform'
                          }
                        />
                      </button>
                      {(section.title === 'MORE' ? isMoreOpen : isMaintainOpen) && (
                        <div className="flex flex-col gap-1">
                          {section.items.map((item) => (
                            <Link
                              key={item.href}
                              href={`/${item.href}`}
                              className={buttonVariants({
                                variant: isLinkActive(pathname, item.href) ? 'sidebarActiveItem' : 'sidebarItem',
                                className: 'w-full',
                              })}
                              onClick={() => setIsOpen((prev) => !prev)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground/80">{section.title}</p>
                      <div className="flex flex-col gap-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={`/${item.href}`}
                            className={buttonVariants({
                              variant: isLinkActive(pathname, item.href) ? 'sidebarActiveItem' : 'sidebarItem',
                              className: 'w-full',
                            })}
                            onClick={() => setIsOpen((prev) => !prev)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
