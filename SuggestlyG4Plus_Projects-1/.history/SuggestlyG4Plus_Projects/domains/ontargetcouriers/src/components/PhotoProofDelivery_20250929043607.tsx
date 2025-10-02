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

  const getPhotoTypeColor = (type: string) => {
    switch (type) {
      case 'pickup': return 'bg-blue-100 text-blue-800';
      case 'delivery': return 'bg-green-100 text-green-800';
      case 'damage': return 'bg-red-100 text-red-800';
      case 'signature': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Camera className="h-6 w-6 mr-2 text-primary-600" />
              Photo Proof of Delivery
            </h3>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-primary-600 to-primary-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <p className="text-gray-600">
            View and upload photos documenting your package's journey from pickup to delivery.
            {trackingNumber && ` Tracking: ${trackingNumber}`}
          </p>
        </div>

        {/* Photo Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={photo.imageUrl}
                    alt={`${photo.type} photo`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={getPhotoTypeColor(photo.type)}>
                      <span className="mr-1">{getPhotoTypeIcon(photo.type)}</span>
                      {photo.type}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(photo);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">{photo.type}</span>
                    <span className="text-xs text-gray-500">
                      {photo.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{photo.location}</p>
                  {photo.notes && (
                    <p className="text-xs text-gray-500 italic">"{photo.notes}"</p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Upload Photo Proof</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo Type
                  </label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pickup">Package Pickup</option>
                    <option value="delivery">Package Delivery</option>
                    <option value="damage">Damage Documentation</option>
                    <option value="signature">Signature Confirmation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photo
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  <p>• Photos help verify package condition</p>
                  <p>• Include timestamps and location data</p>
                  <p>• Maximum file size: 10MB</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Photo Detail Modal */}
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
                    <span className="mr-2">{getPhotoTypeIcon(selectedPhoto.type)}</span>
                    {selectedPhoto.type} Photo
                  </h4>
                  <p className="text-sm text-gray-600">{selectedPhoto.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={`${selectedPhoto.type} photo`}
                  className="w-full max-h-96 object-contain rounded-lg mb-4"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Photo Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp:</span>
                        <span className="font-medium">
                          {selectedPhoto.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedPhoto.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <Badge className={getPhotoTypeColor(selectedPhoto.type)}>
                          {selectedPhoto.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedPhoto.notes && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Notes</h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedPhoto.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Security Notice */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-900 mb-1">Secure & Verified</h5>
              <p className="text-sm text-blue-800">
                All photos are encrypted and stored securely. Photo proof provides additional verification
                for high-value shipments and helps resolve any delivery disputes.
              </p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
}
