
type Card = { title: string; description: string }

export function AboutCards({ cards }: { cards: Card[] }) {
  return (
    <div className="section-shell grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <AnimatedCard key={card.title} card={card} />
      ))}
    </div>
  )
}

function AnimatedCard({ card }: { card: Card }) {

  return (
    <article
      className="group rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md transition-colors duration-300 hover:border-primary/40 hover:bg-card/40"
    >
      <h2 className="text-2xl font-bold transition-colors duration-300 group-hover:text-primary">{card.title}</h2>
      <p className="mt-4 text-muted-foreground">{card.description}</p>
    </article>
  )
}
