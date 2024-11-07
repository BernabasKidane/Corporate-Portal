'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Module {
  id: number;
  title: string;
  description: string | null;
  content: {
    videoUrl?: string;
    readingMaterial?: string;
  };
  order: number;
}

export function ModuleManager() {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    content: {
      videoUrl: '',
      readingMaterial: '',
    },
    order: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/admin/modules');
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      setModules(data);
    } catch (error) {
      setError('Failed to load modules');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newModule),
      });

      if (!response.ok) throw new Error('Failed to create module');

      await fetchModules();
      setNewModule({
        title: '',
        description: '',
        content: {
          videoUrl: '',
          readingMaterial: '',
        },
        order: modules.length + 1,
      });
    } catch (error) {
      setError('Failed to create module');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/modules/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete module');
      await fetchModules();
    } catch (error) {
      setError('Failed to delete module');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Module</CardTitle>
          <CardDescription>Create a new onboarding module</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({ ...newModule, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({ ...newModule, description: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Video URL
              </label>
              <Input
                value={newModule.content.videoUrl}
                onChange={(e) =>
                  setNewModule({
                    ...newModule,
                    content: {
                      ...newModule.content,
                      videoUrl: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reading Material
              </label>
              <Textarea
                value={newModule.content.readingMaterial}
                onChange={(e) =>
                  setNewModule({
                    ...newModule,
                    content: {
                      ...newModule.content,
                      readingMaterial: e.target.value,
                    },
                  })
                }
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <Input
                type="number"
                value={newModule.order}
                onChange={(e) =>
                  setNewModule({
                    ...newModule,
                    order: parseInt(e.target.value) || 1,
                  })
                }
                required
                min={1}
              />
            </div>

            <Button type="submit">Add Module</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Modules</h2>
        {modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>Order: {module.order}</CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(module.id)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{module.description}</p>
                {module.content.videoUrl && (
                  <p className="text-sm">
                    <strong>Video URL:</strong> {module.content.videoUrl}
                  </p>
                )}
                {module.content.readingMaterial && (
                  <div>
                    <strong className="text-sm">Reading Material:</strong>
                    <p className="text-sm whitespace-pre-wrap mt-1">
                      {module.content.readingMaterial}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
