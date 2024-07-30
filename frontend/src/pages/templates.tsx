import { useEffect, useState } from "react";
import { handleFetch } from "../utils/handleFetch";
import { handleSubmit } from "../utils/handleSubmit";

export default function Templates() {
  const [loading, setLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<any[]>([]);

  const onSuccess = (data: any[]) => {
    setTemplates(data);
  };

  useEffect(() => {
    if (templates.length) {
      templates.forEach((template) => {
        const textInputArea = document.querySelector(
          `#text-${template._id}`
        ) as HTMLTextAreaElement;
        textInputArea.value = template.text;
      });
    }
  }, [templates]);

  useEffect(() => {
    handleFetch("/templates", setLoading, onSuccess, console.log);
  }, []);

  return (
    <div className=" space-y-4">
      <p className=" text-lg font-semibold">Templates</p>
      <div className=" grid grid-cols-3 gap-4">
        {templates.map((template, i) => (
          <form
            onSubmit={(e) =>
              handleSubmit(
                e,
                `/templates/${template._id}/edit`,
                setLoading,
                console.log,
                console.log
              )
            }
            className=" border p-2 space-y-2"
            key={template._id}
          >
            <p>
              #{i + 1}. {template.name} :{" "}
            </p>
            <p className=" text-xs">{template.instructions}</p>
            <textarea
              name="text"
              id={`text-${template._id}`}
              rows={6}
              className=" w-full border"
            />
            <div>
              <button type="submit" className=" border py-1 px-2">
                Save
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
