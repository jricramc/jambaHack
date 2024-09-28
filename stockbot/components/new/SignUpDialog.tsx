'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SignUpScreen from '@/components/new/SignUpScreen'

const SignUpDialog = ({ open, onOpenChange, onSignUp }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up for Deskhead</DialogTitle>
          <DialogDescription>
            Create an account to access all features.
          </DialogDescription>
        </DialogHeader>
        <SignUpScreen onSignUp={onSignUp} />
      </DialogContent>
    </Dialog>
  )
}

export default SignUpDialog