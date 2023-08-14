import JoditReact from "jodit-react-ts";
import 'jodit/build/jodit.min.css';
import { joditConfig } from "../../../utils/constants";

type TopicEditorProps = {
  sectionIndex: number,
  contentToEdit: string,
  onEditChange: (editedContent: string, i: number) => void,
}


export default function TopicEditor({ sectionIndex, contentToEdit, onEditChange }: TopicEditorProps) {
  return (
    <div>
      <JoditReact config={joditConfig} defaultValue={contentToEdit} onChange={(content: string) => onEditChange(content, sectionIndex)} />
    </div>
  );
};
