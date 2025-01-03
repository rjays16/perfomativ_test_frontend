import React from 'react';
import { 
  Box,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Avatar
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

interface PersonalInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  city: string;
  state: string;
  country: string;
  image: string | null;
}

interface EditRecordsProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  selectedPerson: PersonalInfo | null;
  imagePreview: string | undefined;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  BASE_URL: string;
}

const EditRecords: React.FC<EditRecordsProps> = ({
  open,
  onClose,
  onSave,
  selectedPerson,
  imagePreview,
  onImageChange,
  BASE_URL
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Person</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          onSave(new FormData(e.currentTarget));
        }} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={imagePreview || (selectedPerson?.image ? `${BASE_URL}storage/${selectedPerson.image}` : undefined)}
              >
                {selectedPerson ? `${selectedPerson.first_name[0]}${selectedPerson.last_name[0]}` : ''}
              </Avatar>
              <Button
                component="label"
                startIcon={<UploadIcon />}
                variant="outlined"
              >
                Update Photo
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  hidden 
                  onChange={onImageChange}
                />
              </Button>
            </Box>

            <TextField 
              label="First Name" 
              name="first_name" 
              defaultValue={selectedPerson?.first_name} 
              required 
              fullWidth 
            />
            <TextField 
              label="Last Name" 
              name="last_name" 
              defaultValue={selectedPerson?.last_name} 
              required 
              fullWidth 
            />
            <TextField 
              label="Email" 
              name="email" 
              type="email" 
              defaultValue={selectedPerson?.email} 
              required 
              fullWidth 
            />
            <TextField 
              label="Date of Birth" 
              name="date_of_birth" 
              type="date"
              defaultValue={selectedPerson?.date_of_birth}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField 
              label="City" 
              name="city" 
              defaultValue={selectedPerson?.city} 
              required 
              fullWidth 
            />
            <TextField 
              label="State" 
              name="state" 
              defaultValue={selectedPerson?.state} 
              required 
              fullWidth 
            />
            <TextField 
              label="Country" 
              name="country" 
              defaultValue={selectedPerson?.country} 
              required 
              fullWidth 
            />
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Save Changes</Button>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecords;