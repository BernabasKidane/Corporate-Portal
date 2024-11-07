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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash } from 'lucide-react';

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

interface EditingState {
  moduleId: number | null;
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
  const [editing, setEditing] = useState<EditingState>({
    moduleId: null,
  });
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    content: {
      videoUrl: '',
      readingMaterial: '',
    },
    order: 1,
  });

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

  const handleEditClick = (moduleId: number, module: Module) => {
    setEditing({ moduleId });
    setEditForm({
      title: module.title,
      description: module.description || '',
      content: {
        videoUrl: module.content.videoUrl || '',
        readingMaterial: module.content.readingMaterial || '',
      },
      order: module.order,
    });
  };

  const handleUpdateModule = async () => {
    try {
      const response = await fetch(`/api/admin/modules/${editing.moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        fetchModules();
        setEditing({ moduleId: null });
      }
    } catch (error) {
      console.error('Error updating module:', error);
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
          <Card key={module.id} className="mb-4">
            <CardHeader>
              {editing.moduleId === module.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <Input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      placeholder="Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      value={editForm.description || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Video URL
                    </label>
                    <Input
                      value={editForm.content.videoUrl || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          content: {
                            ...editForm.content,
                            videoUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="Video URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Reading Material
                    </label>
                    <Textarea
                      value={editForm.content.readingMaterial || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          content: {
                            ...editForm.content,
                            readingMaterial: e.target.value,
                          },
                        })
                      }
                      placeholder="Reading Material"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Order
                    </label>
                    <Input
                      type="number"
                      value={editForm.order}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          order: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="Order"
                      min={1}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUpdateModule} variant="default">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditing({ moduleId: null })}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditClick(module.id, module)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(module.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </CardHeader>
            {editing.moduleId !== module.id && (
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
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
                    <p className="text-sm">
                      <strong>Order:</strong> {module.order}
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
