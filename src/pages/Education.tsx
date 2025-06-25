
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, BookOpen, Download, Clock, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Education = () => {
  const navigate = useNavigate();

  const videos = [
    {
      id: 1,
      title: "Understanding Perimenopause",
      duration: "12:30",
      description: "Learn about the transition period before menopause and what to expect",
      category: "basics",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Managing Hot Flashes",
      duration: "8:45",
      description: "Practical strategies for coping with vasomotor symptoms",
      category: "symptoms",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 3,
      title: "HRT: Benefits and Risks",
      duration: "15:20",
      description: "Evidence-based information about hormone replacement therapy",
      category: "treatment",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Mood Changes in Menopause",
      duration: "10:15",
      description: "Understanding psychological symptoms and coping strategies",
      category: "symptoms",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Bone Health and Osteoporosis",
      duration: "13:40",
      description: "Protecting your bones during and after menopause",
      category: "health",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 6,
      title: "Sexual Health in Menopause",
      duration: "11:25",
      description: "Addressing intimacy and sexual health concerns",
      category: "health",
      thumbnail: "/placeholder.svg"
    }
  ];

  const resources = [
    {
      title: "Menopause Symptom Diary",
      description: "Track your symptoms to discuss with your GP",
      type: "PDF",
      category: "tools"
    },
    {
      title: "Questions to Ask Your Doctor",
      description: "Comprehensive guide for GP appointments",
      type: "PDF",
      category: "advocacy"
    },
    {
      title: "Lifestyle Modifications Guide",
      description: "Evidence-based lifestyle changes for symptom management",
      type: "PDF",
      category: "lifestyle"
    },
    {
      title: "HRT Decision Aid",
      description: "Interactive tool to help consider treatment options",
      type: "Interactive",
      category: "treatment"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredVideos = selectedCategory === "all" 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              NHS Approved Content
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Education Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evidence-based educational resources to help you understand perimenopause 
              and menopause, empowering informed conversations with your healthcare provider.
            </p>
          </div>

          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="videos" className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Video Library</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger value="partner" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Partner Zone</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Videos
                </Button>
                <Button
                  variant={selectedCategory === "basics" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("basics")}
                >
                  Basics
                </Button>
                <Button
                  variant={selectedCategory === "symptoms" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("symptoms")}
                >
                  Symptoms
                </Button>
                <Button
                  variant={selectedCategory === "treatment" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("treatment")}
                >
                  Treatment
                </Button>
                <Button
                  variant={selectedCategory === "health" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("health")}
                >
                  Health
                </Button>
              </div>

              {/* Video Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-500" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>{video.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <div className="grid md:grid-cols-2 gap-6">
                {resources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download {resource.type}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="partner">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Partner Zone</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Resources and guidance for partners, family, and friends to understand 
                  and support women through perimenopause and menopause.
                </p>
                <Button 
                  onClick={() => navigate('/partner-zone')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Visit Partner Zone
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Education;
