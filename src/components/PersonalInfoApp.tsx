import React, { useState, useEffect } from 'react';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody, 
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Search,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AddRecords from './AddRecords';
import EditRecords from './EditRecords';
import DeleteRecords from './DeleteRecords';

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
const BASE_URL = 'http://localhost:8000/';

const PersonalInfoApp = () => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [people, setPeople] = useState<PersonalInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonalInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<PersonalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    if (!isDialogOpen && !isEditDialogOpen) {
      setImagePreview(undefined);
    }
  }, [isDialogOpen, isEditDialogOpen]);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

      await fetchPeople();
      setIsDialogOpen(false);
      setIsEditDialogOpen(false);
      setImagePreview(undefined);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/personal-information/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Network response was not ok');
      await fetchPeople();
      setIsDeleteDialogOpen(false);
      setPersonToDelete(null);
    } catch (error) {
      console.error('Error deleting:', error);
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
            >
              Add Person
            </Button>
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
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => {
                          setPersonToDelete(person);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
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

      <AddRecords 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        selectedPerson={null}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        BASE_URL={BASE_URL}
      />

      <EditRecords 
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSave}
        selectedPerson={selectedPerson}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        BASE_URL={BASE_URL}
      />

      <DeleteRecords 
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setPersonToDelete(null);
        }}
        onConfirm={() => personToDelete ? handleDelete(personToDelete.id) : Promise.resolve()}
        personName={personToDelete ? `${personToDelete.first_name} ${personToDelete.last_name}` : ''}
      />
    </Box>
  );
};

export default PersonalInfoApp;