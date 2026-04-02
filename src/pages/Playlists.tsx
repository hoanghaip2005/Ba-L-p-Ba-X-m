import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ListMusic, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Playlists() {
  const { user } = useAuth();
  const [publicPlaylists, setPublicPlaylists] = useState<any[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const publicRes = await api.get('/playlists/public');
      setPublicPlaylists(publicRes.data.data.playlists || []);
      
      if (user) {
        const userRes = await api.get('/playlists');
        setUserPlaylists(userRes.data.data.playlists || []);
      }
    } catch (error) {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await api.post('/playlists', { name: newTitle, description: newDescription });
      toast.success('Playlist created!');
      setNewTitle('');
      setNewDescription('');
      fetchPlaylists(); // refresh
    } catch (error) {
      toast.error('Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const renderPlaylistCards = (playlists: any[]) => {
    if (playlists.length === 0) return <div className="py-8 text-center text-muted-foreground">No playlists found.</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map(pl => (
          <Card key={pl.id} className="hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ListMusic className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{pl.name}</CardTitle>
                  <CardDescription className="line-clamp-1">{pl.description || 'No description'}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              <Link to={`/playlists/${pl.id}`} className="w-full">
                <Button variant="secondary" className="w-full">View Playlist</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Playlists</h1>
          <p className="text-muted-foreground">Curated collections just for you.</p>
        </div>
      </div>

      <Tabs defaultValue="public" className="w-full">
        <TabsList>
          <TabsTrigger value="public">Public Playlists</TabsTrigger>
          {user && <TabsTrigger value="my">My Playlists</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="public" className="mt-6">
          {loading ? <div>Loading...</div> : renderPlaylistCards(publicPlaylists)}
        </TabsContent>
        
        {user && (
          <TabsContent value="my" className="mt-6 space-y-8">
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-6">
                <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-2 w-full">
                    <label className="text-sm font-medium">Playlist Name</label>
                    <Input required placeholder="E.g. My Awesome Mix" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <label className="text-sm font-medium">Description</label>
                    <Input placeholder="Optional description..." value={newDescription} onChange={e => setNewDescription(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={creating} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    {creating ? 'Creating...' : 'Create'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {loading ? <div>Loading...</div> : renderPlaylistCards(userPlaylists)}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
