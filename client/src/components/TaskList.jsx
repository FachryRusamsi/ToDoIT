import TaskCard from './TaskCard';

export default function TaskList({ tasks, onDelete }) {
  if (!tasks.length)
    return (
      <div className="mt-6 flex justify-center">
        <div className="text-center text-sm text-base-content/70">
          <p>No tasks yet.</p>
          <p>Add one to get started 🚀</p>
        </div>
      </div>
    );

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {tasks.map((t) => (
        <TaskCard key={t._id} task={t} onDelete={onDelete} />
      ))}
    </div>
  );
}
