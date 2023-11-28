# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    # Choose a base image
    config.vm.box = "ubuntu/bionic64"
  
    # Network configuration
    config.vm.network "private_network", type: "dhcp"
  
    # Provider-specific settings
    config.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 2
    end
  
    # Provisioning scripts
    config.vm.provision "shell", inline: <<-SHELL
      # Update and install prerequisites
      apt-get update
      apt-get install -y apt-transport-https ca-certificates curl software-properties-common
  
      # Add Docker’s official GPG key
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  
      # Set up the Docker repository
      add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  
      # Install Docker CE
      apt-get update
      apt-get install -y docker-ce
  
      # Install Docker Compose
      curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      chmod +x /usr/local/bin/docker-compose

      # Clone your GitHub repository
      git clone https://github.com/MaticMermolja/harmony.git /home/vagrant/harmony

      # Navigate to your project directory
      cd /home/vagrant/harmony

      # Run Docker Compose (assuming you have a docker-compose.yml)
      docker-compose -f docker-compose.dev.yml up -d
      SHELL
  end
  