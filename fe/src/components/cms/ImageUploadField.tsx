import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getUploadErrorMessage, uploadCmsImage } from "@/lib/cms";
import { mediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const MAX_MB = 5;

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  className,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const preview = value ? mediaUrl(value) : "";

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "File harus berupa gambar", variant: "error" });
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast({ title: `Maksimal ${MAX_MB} MB per gambar`, variant: "error" });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadCmsImage(file);
      onChange(url);
      toast({ title: "Gambar diunggah", variant: "success" });
    } catch (err) {
      toast({ title: getUploadErrorMessage(err), variant: "error" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium">{label}</label>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-destructive hover:text-destructive"
            onClick={() => onChange("")}
          >
            <Trash2 className="size-3.5" />
            Hapus
          </Button>
        ) : null}
      </div>

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border bg-muted/30">
          <img src={preview} alt="" className="max-h-48 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-background/90 to-transparent p-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Ganti gambar
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-muted/40",
            uploading && "pointer-events-none opacity-70"
          )}
        >
          {uploading ? (
            <Loader2 className="size-8 animate-spin text-primary" />
          ) : (
            <ImagePlus className="size-8 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {uploading ? "Mengunggah..." : "Klik atau seret gambar ke sini"}
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WebP, GIF — maks. {MAX_MB} MB
          </span>
        </button>
      )}

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
    </div>
  );
}
