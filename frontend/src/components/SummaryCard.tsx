type Props = {
  title: string;
  value: string;
  positive?: boolean;
};

const SummaryCard = ({
  title,
  value,
  positive,
}: Props) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2
        className={`mt-2 text-3xl font-bold ${
          positive === undefined
            ? 'text-white'
            : positive
            ? 'text-green-500'
            : 'text-red-500'
        }`}
      >
        {value}
      </h2>
    </div>
  );
};

export default SummaryCard;