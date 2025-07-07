
export interface AssessmentLink {
  sessionId: string;
  firstName?: string;
  surname?: string;
  dateOfBirth?: string;
  nhsId?: string;
  createdBy: string; // GP email
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'completed' | 'expired';
}

export interface CompletedAssessment {
  sessionId: string;
  patientRef: string;
  completedAt: string;
  riskLevel: string;
  urgentFlags: string[];
  rawData: any;
}

class DataStore {
  private getUserKey(userEmail: string): string {
    return `${userEmail}_assessments`;
  }

  private getCompletedKey(userEmail: string): string {
    return `${userEmail}_completed_assessments`;
  }

  // Create a new assessment link
  createAssessmentLink(
    userEmail: string,
    patientData: {
      firstName?: string;
      surname?: string;
      dateOfBirth?: string;
      nhsId?: string;
    }
  ): AssessmentLink {
    const sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours

    const assessmentLink: AssessmentLink = {
      sessionId,
      firstName: patientData.firstName,
      surname: patientData.surname,
      dateOfBirth: patientData.dateOfBirth,
      nhsId: patientData.nhsId,
      createdBy: userEmail,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'active'
    };

    // Get existing assessments for this user
    const existingAssessments = this.getAssessmentLinks(userEmail);
    existingAssessments.push(assessmentLink);

    // Store back to localStorage
    localStorage.setItem(this.getUserKey(userEmail), JSON.stringify(existingAssessments));

    console.log(`✅ Assessment link created for ${userEmail}:`, assessmentLink);
    return assessmentLink;
  }

  // Get all assessment links for a specific user
  getAssessmentLinks(userEmail: string): AssessmentLink[] {
    try {
      const stored = localStorage.getItem(this.getUserKey(userEmail));
      if (!stored) return [];
      
      const assessments: AssessmentLink[] = JSON.parse(stored);
      
      // Update expired assessments
      const now = new Date();
      const updatedAssessments = assessments.map(assessment => {
        if (assessment.status === 'active' && new Date(assessment.expiresAt) < now) {
          return { ...assessment, status: 'expired' as const };
        }
        return assessment;
      });

      // Save updated statuses if any changed
      const hasExpired = updatedAssessments.some((assessment, index) => 
        assessment.status !== assessments[index].status
      );
      
      if (hasExpired) {
        localStorage.setItem(this.getUserKey(userEmail), JSON.stringify(updatedAssessments));
      }

      return updatedAssessments;
    } catch (error) {
      console.error(`❌ Error loading assessments for ${userEmail}:`, error);
      return [];
    }
  }

  // Mark an assessment as completed
  completeAssessment(sessionId: string, completedData: CompletedAssessment): void {
    console.log(`📝 Marking assessment ${sessionId} as completed`);
    
    // Find which user created this assessment
    const assessmentLink = this.findAssessmentLinkBySession(sessionId);
    if (!assessmentLink) {
      console.error(`❌ No assessment link found for session ${sessionId}`);
      return;
    }

    const userEmail = assessmentLink.createdBy;
    
    // Update the assessment link status
    const assessments = this.getAssessmentLinks(userEmail);
    const updatedAssessments = assessments.map(assessment => 
      assessment.sessionId === sessionId 
        ? { ...assessment, status: 'completed' as const }
        : assessment
    );
    
    localStorage.setItem(this.getUserKey(userEmail), JSON.stringify(updatedAssessments));

    // Store the completed assessment data
    const completedAssessments = this.getCompletedAssessments(userEmail);
    completedAssessments.push(completedData);
    localStorage.setItem(this.getCompletedKey(userEmail), JSON.stringify(completedAssessments));

    console.log(`✅ Assessment ${sessionId} marked as completed for ${userEmail}`);
  }

  // Get completed assessments for a user
  getCompletedAssessments(userEmail: string): CompletedAssessment[] {
    try {
      const stored = localStorage.getItem(this.getCompletedKey(userEmail));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(`❌ Error loading completed assessments for ${userEmail}:`, error);
      return [];
    }
  }

  // Find assessment link by session ID (searches across all users) - NOW PUBLIC
  findAssessmentLinkBySession(sessionId: string): AssessmentLink | null {
    // Get all localStorage keys that end with '_assessments'
    const keys = Object.keys(localStorage).filter(key => key.endsWith('_assessments'));
    
    for (const key of keys) {
      try {
        const assessments: AssessmentLink[] = JSON.parse(localStorage.getItem(key) || '[]');
        const found = assessments.find(assessment => assessment.sessionId === sessionId);
        if (found) return found;
      } catch (error) {
        console.error(`❌ Error searching assessments in ${key}:`, error);
      }
    }
    
    return null;
  }

  // Get assessment link by session ID for a specific user
  getAssessmentLink(userEmail: string, sessionId: string): AssessmentLink | null {
    const assessments = this.getAssessmentLinks(userEmail);
    return assessments.find(assessment => assessment.sessionId === sessionId) || null;
  }

  // Get statistics for a user
  getAssessmentStats(userEmail: string): {
    total: number;
    active: number;
    completed: number;
    expired: number;
  } {
    const assessments = this.getAssessmentLinks(userEmail);
    
    return {
      total: assessments.length,
      active: assessments.filter(a => a.status === 'active').length,
      completed: assessments.filter(a => a.status === 'completed').length,
      expired: assessments.filter(a => a.status === 'expired').length
    };
  }

  // Clean up expired assessments (optional utility method)
  cleanupExpiredAssessments(userEmail: string): void {
    const assessments = this.getAssessmentLinks(userEmail);
    const activeAssessments = assessments.filter(assessment => assessment.status !== 'expired');
    
    if (activeAssessments.length !== assessments.length) {
      localStorage.setItem(this.getUserKey(userEmail), JSON.stringify(activeAssessments));
      console.log(`🧹 Cleaned up ${assessments.length - activeAssessments.length} expired assessments for ${userEmail}`);
    }
  }
}

// Export a singleton instance
export const dataStore = new DataStore();
