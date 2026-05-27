import type { Media } from "@prisma/client";

interface Props {
  medias: Media[];
}

export default function MediaGallery({ medias }: Props) {
  if (medias.length === 0) return null;

  return (
    <div className="overflow-hidden">
      {medias.map((media) => {
        if (media.type === "IMAGE") {
          return (
            <img
              key={media.id}
              src={media.url}
              alt={media.filename}
              className="w-full max-h-96 object-cover"
            />
          );
        }
        if (media.type === "VIDEO") {
          return (
            <video
              key={media.id}
              src={media.url}
              controls
              className="w-full max-h-96"
            />
          );
        }
        if (media.type === "AUDIO") {
          return (
            <audio
              key={media.id}
              src={media.url}
              controls
              className="w-full mt-2"
            />
          );
        }
        return null;
      })}
    </div>
  );
}
