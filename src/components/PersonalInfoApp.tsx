import React, { useState, useEffect } from 'react';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody, 
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Stack
} from '@mui/material';
import {
  Search,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';

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

const API_URL = 'http://localhost:8000/api';
const BASE_URL = 'http://localhost:8000/'
const PersonalInfoApp = () => {
  const [people, setPeople] = useState<PersonalInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonalInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch(`${API_URL}/personal-information`);
      const data = await response.json();
      setPeople(data.sql_data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPeople = people.filter(person => 
    person.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (formData: FormData) => {
    try {
      const url = selectedPerson 
        ? `${API_URL}/personal-information/${selectedPerson.id}`
        : `${API_URL}/personal-information`;

      // For update, we need to add _method field
      if (selectedPerson) {
        formData.append('_method', 'PUT');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) throw new Error('Network response was not ok');

      fetchPeople();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`${API_URL}/personal-information/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Network response was not ok');
        fetchPeople();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Personal Information</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            Manage personal records
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search records..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
           <Button 
           variant="contained" 
           startIcon={<AddIcon />}
           onClick={() => {
            setSelectedPerson(null);
            setIsDialogOpen(true);
          }}
          sx={{ 
            backgroundColor: '#2196f3',
            color: 'white',
            fontWeight: 'bold',
            padding: '8px 16px',
            whiteSpace: 'nowrap', 
            '&:hover': {
              backgroundColor: '#1976d2'
            }
            }}
            >Add Person</Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Place of Birth</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : (
                filteredPeople.map(person => (
                  <TableRow key={person.id}>
                    <TableCell>
                      <Avatar 
                        src={person.image ? `${BASE_URL}storage/${person.image}` : undefined}
                        alt={`${person.first_name} ${person.last_name}`}
                      >
                        {`${person.first_name[0]}${person.last_name[0]}`}
                      </Avatar>
                    </TableCell>
                    <TableCell>{`${person.first_name} ${person.last_name}`}</TableCell>
                    <TableCell>{new Date(person.date_of_birth).toLocaleDateString()}</TableCell>
                    <TableCell>{`${person.city}, ${person.state}, ${person.country}`}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setSelectedPerson(person);
                          setIsDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(person.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedPerson ? 'Edit Person' : 'Add New Person'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSave(new FormData(e.currentTarget));
          }} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={selectedPerson?.image ? `${BASE_URL}storage/${selectedPerson.image}` : undefined}
                >
                  {selectedPerson ? `${selectedPerson.first_name[0]}${selectedPerson.last_name[0]}` : 'UP'}
                </Avatar>
                <Button
                  component="label"
                  startIcon={<UploadIcon />}
                  variant="outlined"
                >
                  Upload Photo
                  <input type="file" name="image" accept="image/*" hidden />
                </Button>
              </Box>

              <TextField label="First Name" name="first_name" defaultValue={selectedPerson?.first_name} required fullWidth />
              <TextField label="Last Name" name="last_name" defaultValue={selectedPerson?.last_name} required fullWidth />
              <TextField label="Email" name="email" type="email" defaultValue={selectedPerson?.email} required fullWidth />
              <TextField 
                label="Date of Birth" 
                name="date_of_birth" 
                type="date"
                defaultValue={selectedPerson?.date_of_birth}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField label="City" name="city" defaultValue={selectedPerson?.city} required fullWidth />
              <TextField label="State" name="state" defaultValue={selectedPerson?.state} required fullWidth />
              <TextField label="Country" name="country" defaultValue={selectedPerson?.country} required fullWidth />
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Save</Button>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PersonalInfoApp;