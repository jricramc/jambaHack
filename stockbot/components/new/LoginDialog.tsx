'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import LoginScreen from './LoginScreen'

const LoginDialog = ({ open, onOpenChange, onLogin, onSignUp }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to Deskhead</DialogTitle>
          <DialogDescription>
            Enter your credentials to access all features.
          </DialogDescription>
        </DialogHeader>
        <LoginScreen onLogin={onLogin} onSignUp={onSignUp} />
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog