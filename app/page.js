import ConnectionTest from './components/ConnectionTest';
import UserRegistrationTest from './components/UserRegistrationTest';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectionTest />
      <UserRegistrationTest />
      {/* ... rest of your existing code ... */}
    </main>
  );
} 