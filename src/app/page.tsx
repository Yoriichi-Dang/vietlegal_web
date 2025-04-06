import ThemeModeToggle from "@/components/ui/theme-mode-toggle";

export default function Home() {
  return (
    <div>
      <main className="h-svh text-center bg-background p-20">
        <h1 className="text-foreground/50 text-4xl font-bold mb-4">
          Build an Electron app with{" "}
          <span className="text-primary font-semibold">React</span> and{" "}
          <span className=" text-foreground font-semibold">TypeScript</span>
        </h1>
        <div className="bg-foreground/10 p-4 rounded-lg inline-block mb-8">
          <p className="text-foreground/80">
            Press{" "}
            <code className="bg-foreground/30 px-2 py-1 rounded">F12</code> to
            open DevTools
          </p>
        </div>
        <div className="flex gap-4 justify-center items-center mb-12">
          <a
            href="https://electron-vite.org/"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2 text-primary-foreground 
      bg-primary hover:bg-secondary rounded-full transition-colors"
          >
            Documentation
          </a>
          <ThemeModeToggle />
        </div>
      </main>
    </div>
  );
}
