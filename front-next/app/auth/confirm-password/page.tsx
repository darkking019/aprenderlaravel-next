import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/input';

<div className="space-y-6">
  <div>
    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Senha
    </label>
    <Input
      id="password"
      name="password"
      type="password"
      required
      placeholder="••••••••"
      autoComplete="current-password"
    />
  </div>

  <div className="flex justify-end mt-6">
    <Button variant="primary" type="submit">
      Confirmar
    </Button>
  </div>
</div>