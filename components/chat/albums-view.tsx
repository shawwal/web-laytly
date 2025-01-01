// src/screens/albums-screen.tsx
'use client';

import React from 'react';
import { AlbumList } from '@/components/album-list';
// import { CreateFolderModal } from '@/components/create-folder-modal'; // CreateFolderModal component
// import { Button } from '@/components/ui/button'; // A Button component
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';

export function AlbumsView() {
  // const [isModalVisible, setModalVisible] = useState(false);

  // const openModal = () => setModalVisible(true);
  // const closeModal = () => setModalVisible(false);

  // const handleCreateFolder = async (folderName: string) => {
  //   // Handle folder creation (you can integrate API logic here)
  //   console.log('Creating folder:', folderName);
  //   closeModal();
  // };

  return (
    <>
      <AlbumList onRefresh={() => console.log('Refresh albums')} />
      {/* <Button
        variant="primary"
        className="fixed bottom-5 right-5 p-4 rounded-full"
        onClick={openModal}
      >
        <FontAwesomeIcon icon={faFolderPlus} size="lg" color="white" />
      </Button>
      <CreateFolderModal
        visible={isModalVisible}
        onClose={closeModal}
        onCreateFolder={handleCreateFolder}
      /> */}
    </>
  );
}
