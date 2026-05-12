export default function Footer() {
  return (
    <footer className="border-t bg-card/60 mt-12">
      <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <span>Developed by <span className="font-medium text-foreground">Mikel Llobera</span></span>
          <span className="hidden sm:inline">·</span>
          <a href="mailto:mikelguelbenzu@gmail.com" className="hover:text-foreground transition-colors">mikelguelbenzu@gmail.com</a>
          <span className="hidden sm:inline">·</span>
          <a href="https://github.com/MikelLG" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <span className="hidden sm:inline">·</span>
          <a href="https://www.linkedin.com/in/mikel-llobera-guelbenzu/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
          <span className="hidden sm:inline">·</span>
          <a href="https://espaifacto.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">espaifacto.com</a>
        </div>
        <div className="flex items-center gap-1.5">
          <span>In collaboration with</span>
          <a href="https://www.lichenis.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:underline transition-colors">Lichen.is</a>
        </div>
      </div>
    </footer>
  );
}
