export default function SectionHeader({ title, subtitle, className }) {
  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-xs font-semibold text-blue-700 uppercase tracking-[0.2em] mb-4">{subtitle}</h2>
      <h3 className="text-3xl md:text-4xl font-medium text-white tracking-tight">{title}</h3>
    </div>
  );
}
