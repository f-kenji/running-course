import { CourseRow } from "@/types/course.type";
import Button from "../ui/Button";

type Props = {
    inputStyle: string,
    gpxFile: File | string | null,
    setGpxFile: (file: File | null) => void
    isEdit?: boolean;        // 編集モードかどうか
    existingGpxUrl?: string | null; // 既存 GPX URL
};

export default function GpxUploadForm({ inputStyle, gpxFile, setGpxFile, isEdit, existingGpxUrl }: Props) {
    console.log("gpxFile", gpxFile)
    return (
        <>
            <label className="block mb-1 font-medium">
                {isEdit ? "差し替えるGPXファイルを選択" : "GPXファイルを選択"}
            </label>
            <div className="flex">
            <label
                htmlFor="gpx-upload"
                className=" w-110 border-2 border-rose-200 bg-white hover:bg-rose-100 rounded-xl text-center cursor-pointer py-1"
            >
                {gpxFile ? (gpxFile instanceof File ? gpxFile.name : gpxFile.split("/").pop()) : "GPXを選択"}
            </label>
                {gpxFile && (
                    <Button
                        type="button"
                        onClick={() => setGpxFile(null)}
                        variant="secondary"
                        className="w-20 ml-3"
                    >
                        クリア
                    </Button>
                )}
                <input
                    id="gpx-upload"
                    type="file"
                    accept=".gpx"
                    placeholder="GPXを選択"
                    onChange={e => setGpxFile(e.target.files?.[0] || null)}
                    required
                    className="hidden" />
            </div>
            {isEdit && existingGpxUrl && (
                <p className="text-sm text-gray-500">
                    現在のファイル: {existingGpxUrl?.split('/').pop()}
                </p>
            )}
        </>

    )
}