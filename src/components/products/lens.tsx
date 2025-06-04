import {
    Card,
    CardHeader,
} from "@/components/ui/card";
import { Lens } from "@/registry/magicui/lens/Lens";

export function LensDemo({ imageUrl }: { imageUrl: string }) {
    return (
        <Card className="relative max-w-md shadow-none">
            <CardHeader>
                <Lens
                    zoomFactor={2}
                    lensSize={150}
                    isStatic={false}
                    ariaLabel="Zoom Area"
                >
                    <img
                        src={imageUrl}
                        alt="image placeholder"
                        width={500}
                        height={500}
                    />
                </Lens>
            </CardHeader>
        </Card>
    );
}
