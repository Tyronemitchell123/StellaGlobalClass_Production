'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, CheckCircle, X, Eye, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PhotoProof {
  id: string;
  type: 'pickup' | 'delivery' | 'damage' | 'signature';
  imageUrl: string;
  timestamp: Date;
  location: string;
  notes?: string;
}

interface PhotoProofDeliveryProps {
  trackingNumber?: string;
  onPhotoUpload?: (photo: PhotoProof) => void;
}

export function PhotoProofDelivery({ trackingNumber, onPhotoUpload }: PhotoProofDeliveryProps) {
  const [photos, setPhotos] = useState<PhotoProof[]>([
    {
      id: '1',
      type: 'pickup',
      imageUrl: '/api/placeholder/400/300',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      location: '123 Main St, New York, NY',
      notes: 'Package picked up from front desk'
    },
    {
      id: '2',
      type: 'delivery',
      imageUrl: '/api/placeholder/400/300',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      location: '456 Oak Ave, New York, NY',
      notes: 'Delivered to recipient at front door'
    }
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoProof | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'pickup' | 'delivery' | 'damage' | 'signature'>('pickup');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock photo upload
      const newPhoto: PhotoProof = {
        id: Date.now().toString(),
        type: uploadType,
        imageUrl: URL.createObjectURL(file),
        timestamp: new Date(),
        location: 'Current Location',
        notes: `${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} photo uploaded by client`
      };

      setPhotos([...photos, newPhoto]);
      if (onPhotoUpload) {
        onPhotoUpload(newPhoto);
      }
      setShowUploadModal(false);
    }
  };

  const getPhotoTypeIcon = (type: string) => {
    switch (type) {
      case 'pickup': return '📦';
      case 'delivery': return '✅';
      case 'damage': return '⚠️';
      case 'signature': return '✍️';
      default: return '📷';
    }
  };

