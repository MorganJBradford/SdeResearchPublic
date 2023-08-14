import {
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import JoditReact from "jodit-react-ts";
import 'jodit/build/jodit.min.css';
import { useTheme } from '@mui/material';
import { joditConfig } from '../../../../utils/constants';



type NewsCardProps = {
  news: {
    title: string,
    body: string,
  },
  onChange: (editedContent: string, editingTitle: boolean) => void
}

export default function AddNewsCard({ news, onChange }: NewsCardProps) {
  const theme = useTheme();
  return (
    <Card sx={{
      width: '80vw', backgroundColor: theme.palette.primaryPalette.darkColor
    }}>
      <CardHeader
        title={
          <JoditReact config={joditConfig} onChange={(content) => onChange(content, true)} defaultValue={news.title} />
        }
      />
      <CardContent sx={{ paddingTop: '8px' }}>
        <JoditReact config={joditConfig} onChange={(content) => onChange(content, false)} defaultValue={news.body} />
      </CardContent>
    </Card >
  );
}
