import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Play, Disc3, Calendar } from 'lucide-react';

export default function SongDetail() {
  const { id } = useParams();
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await api.get(`/songs/${id}`);
        setSong(res.data.data.song);
      } catch (error) {
        toast.error('Failed to load song details');
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!song) return <div>Song not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Songs
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="w-full md:w-1/3 overflow-hidden shrink-0 border-none shadow-xl bg-muted/20">
          <div className="aspect-square flex justify-center items-center relative overflow-hidden">
             {song.image_url ? (
               <img src={song.image_url} alt={song.title} className="object-cover w-full h-full" />
             ) : (
               <Disc3 className="w-32 h-32 text-muted-foreground/30 animate-spin-slow" />
             )}
          </div>
        </Card>

        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                {song.genre || 'Music'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{song.title}</h1>
            <p className="text-2xl text-muted-foreground">{song.artist}</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
            {song.release_date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Release Date: {new Date(song.release_date).toLocaleDateString()}</span>
              </div>
            )}
            {song.duration && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Play className="w-4 h-4" />
                <span className="text-sm">Duration: {song.duration}</span>
              </div>
            )}
          </div>

          <div className="pt-6">
            {song.audio_url ? (
              <div className="bg-card p-4 rounded-xl shadow-inner border">
                <audio controls className="w-full h-12" src={song.audio_url} autoPlay={false}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <Button disabled variant="outline" className="w-full">
                Audio Not Available
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
