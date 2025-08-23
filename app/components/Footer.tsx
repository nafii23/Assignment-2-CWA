export default function Footer() {
  const today = new Date().toLocaleDateString();

  return (
    <footer className="bg-gray-200 dark:bg-gray-800 text-center p-4 text-sm">
      <p>
        © {today} | Abdinafi Mohamed | Student #: 22206653
      </p>
    </footer>
  );
}
