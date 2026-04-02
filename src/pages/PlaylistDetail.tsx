import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, Plus, Music2 } from 'lucide-react';

export default function PlaylistDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchSong, setSearchSong] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchPlaylistData();
  }, [id]);

  const fetchPlaylistData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/playlists/${id}/songs`);
      setPlaylist(res.data.data.playlist);
      setSongs(res.data.data.songs || []);
    } catch (error) {
      toast.error('Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSongs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchSong.trim()) return;
    setSearching(true);
    try {
      const res = await api.get('/songs', { params: { q: searchSong, limit: 5 } });
      setSearchResults(res.data.data);
    } catch (error) {
      toast.error('Failed to search songs');
    } finally {
      setSearching(false);
    }
  };

  const addSong = async (songId: number) => {
    try {
      await api.post(`/playlists/${id}/songs`, { song_id: songId });
      toast.success('Song added to playlist');
      setSearchResults([]);
      setSearchSong('');
      fetchPlaylistData();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to add song');
    }
  };

  const removeSong = async (songId: number) => {
    try {
      await api.delete(`/playlists/${id}/songs/${songId}`);
      toast.success('Song removed');
      fetchPlaylistData();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to remove song');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!playlist) return <div>Playlist not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link to="/playlists" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Playlists
      </Link>

      <div className="bg-muted/30 p-8 rounded-2xl border">
        <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
        <p className="text-xl text-muted-foreground">{playlist.description || 'No description provided.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Music2 className="text-primary" />
            Songs in Playlist
          </h2>
          
          {songs.length === 0 ? (
            <div className="p-12 text-center border border-dashed rounded-xl text-muted-foreground">
              No songs in this playlist yet.
            </div>
          ) : (
             <div className="space-y-3">
               {songs.map((song, index) => (
                 <Card key={song.id} className="flex items-center justify-between p-4 group">
                   <div className="flex items-center gap-4">
                     <span className="text-muted-foreground font-mono w-6 text-right">{index + 1}</span>
                     <div>
                       <Link to={`/songs/${song.id}`} className="font-semibold hover:text-primary hover:underline block">
                         {song.title}
                       </Link>
                       <span className="text-sm text-muted-foreground">{song.artist}</span>
                     </div>
                   </div>
                   {user && (
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                       onClick={() => removeSong(song.id)}
                       title="Remove from playlist"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   )}
                 </Card>
               ))}
             </div>
          )}
        </div>

        {user && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Add Songs</h3>
            <Card className="p-4 bg-muted/20">
              <form onSubmit={handleSearchSongs} className="flex gap-2">
                <Input 
                  placeholder="Search songs to add..." 
                  value={searchSong}
                  onChange={(e) => setSearchSong(e.target.value)}
                />
                <Button type="submit" disabled={searching}>Search</Button>
              </form>

              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {searchResults.map(song => (
                    <div key={song.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 border text-sm">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      <Button size="icon" variant="secondary" onClick={() => addSong(song.id)} className="shrink-0 h-8 w-8">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
