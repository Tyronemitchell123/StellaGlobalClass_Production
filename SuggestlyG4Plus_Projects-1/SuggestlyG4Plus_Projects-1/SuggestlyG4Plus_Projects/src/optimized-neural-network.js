/**
 * Optimized Neural Network - Functional Implementation
 * 
 * A practical neural network implementation with actual functionality
 * for pattern recognition and basic machine learning tasks.
 */

export class OptimizedNeuralNetwork {
    constructor(config = {}) {
        this.layers = [];
        this.weights = [];
        this.biases = [];
        this.activations = [];
        this.learningRate = config.learningRate || 0.01;
        this.epochs = config.epochs || 100;
        this.batchSize = config.batchSize || 32;
        
        this.architecture = config.architecture || [4, 8, 8, 2]; // Default architecture
        this.activationFunction = config.activation || 'relu';
        this.lossFunction = config.loss || 'mse';
        
        this.trainingHistory = [];
        this.isTrained = false;
    }

    async initialize() {
        console.log('🧠 Initializing Optimized Neural Network...');
        
        // Build network architecture
        this.buildNetwork();
        
        // Initialize weights and biases
        this.initializeWeights();
        
        console.log('✅ Neural Network initialized successfully');
    }

    buildNetwork() {
        // Create layers based on architecture
        for (let i = 0; i < this.architecture.length; i++) {
            this.layers.push({
                size: this.architecture[i],
                type: i === 0 ? 'input' : i === this.architecture.length - 1 ? 'output' : 'hidden'
            });
        }
    }

    initializeWeights() {
        // Initialize weights with Xavier/Glorot initialization
        for (let i = 0; i < this.layers.length - 1; i++) {
            const inputSize = this.layers[i].size;
            const outputSize = this.layers[i + 1].size;
            
            // Xavier initialization
            const scale = Math.sqrt(2.0 / (inputSize + outputSize));
            const weights = [];
            
            for (let j = 0; j < inputSize; j++) {
                const row = [];
                for (let k = 0; k < outputSize; k++) {
                    row.push((Math.random() - 0.5) * 2 * scale);
                }
                weights.push(row);
            }
            
            this.weights.push(weights);
            
            // Initialize biases
            const biases = [];
            for (let j = 0; j < outputSize; j++) {
                biases.push(0);
            }
            this.biases.push(biases);
        }
    }

    async train(trainingData, labels) {
        console.log('🎯 Training Neural Network...');
        
        if (trainingData.length !== labels.length) {
            throw new Error('Training data and labels must have the same length');
        }

        for (let epoch = 0; epoch < this.epochs; epoch++) {
            let totalLoss = 0;
            
            // Mini-batch training
            for (let i = 0; i < trainingData.length; i += this.batchSize) {
                const batchData = trainingData.slice(i, i + this.batchSize);
                const batchLabels = labels.slice(i, i + this.batchSize);
                
                const batchLoss = await this.trainBatch(batchData, batchLabels);
                totalLoss += batchLoss;
            }
            
            const avgLoss = totalLoss / Math.ceil(trainingData.length / this.batchSize);
            this.trainingHistory.push({ epoch, loss: avgLoss });
            
            if (epoch % 10 === 0) {
                console.log(`Epoch ${epoch}: Loss = ${avgLoss.toFixed(6)}`);
            }
        }
        
        this.isTrained = true;
        console.log('✅ Training completed successfully');
    }

    async trainBatch(batchData, batchLabels) {
        let batchLoss = 0;
        
        for (let i = 0; i < batchData.length; i++) {
            const input = batchData[i];
            const target = batchLabels[i];
            
            // Forward pass
            const activations = this.forwardPass(input);
            
            // Calculate loss
            const loss = this.calculateLoss(activations[activations.length - 1], target);
            batchLoss += loss;
            
            // Backward pass
            this.backwardPass(activations, target);
        }
        
        return batchLoss / batchData.length;
    }

    forwardPass(input) {
        const activations = [input];
        
        for (let i = 0; i < this.weights.length; i++) {
            const prevActivation = activations[i];
            const weights = this.weights[i];
            const biases = this.biases[i];
            
            // Matrix multiplication: prevActivation * weights + biases
            const z = [];
            for (let j = 0; j < weights[0].length; j++) {
                let sum = biases[j];
                for (let k = 0; k < prevActivation.length; k++) {
                    sum += prevActivation[k] * weights[k][j];
                }
                z.push(sum);
            }
            
            // Apply activation function
            const activation = this.applyActivation(z);
            activations.push(activation);
        }
        
        return activations;
    }

    backwardPass(activations, target) {
        // Calculate output layer error
        const output = activations[activations.length - 1];
        const outputError = this.calculateOutputError(output, target);
        
        let error = outputError;
        
        // Backpropagate error
        for (let i = this.weights.length - 1; i >= 0; i--) {
            const activation = activations[i + 1];
            const prevActivation = activations[i];
            
            // Calculate gradients
            const gradients = this.calculateGradients(error, activation);
            
            // Update weights and biases
            this.updateWeights(i, prevActivation, gradients);
            this.updateBiases(i, gradients);
            
            // Calculate error for previous layer
            if (i > 0) {
                error = this.calculateHiddenError(error, this.weights[i], prevActivation);
            }
        }
    }

    applyActivation(z) {
        switch (this.activationFunction) {
            case 'relu':
                return z.map(val => Math.max(0, val));
            case 'sigmoid':
                return z.map(val => 1 / (1 + Math.exp(-val)));
            case 'tanh':
                return z.map(val => Math.tanh(val));
            default:
                return z; // Linear activation
        }
    }

    applyActivationDerivative(z) {
        switch (this.activationFunction) {
            case 'relu':
                return z.map(val => val > 0 ? 1 : 0);
            case 'sigmoid':
                const sigmoid = this.applyActivation(z);
                return sigmoid.map(val => val * (1 - val));
            case 'tanh':
                const tanh = this.applyActivation(z);
                return tanh.map(val => 1 - val * val);
            default:
                return z.map(() => 1); // Linear activation derivative
        }
    }

    calculateLoss(output, target) {
        switch (this.lossFunction) {
            case 'mse':
                return output.reduce((sum, val, i) => sum + Math.pow(val - target[i], 2), 0) / output.length;
            case 'mae':
                return output.reduce((sum, val, i) => sum + Math.abs(val - target[i]), 0) / output.length;
            default:
                return 0;
        }
    }

    calculateOutputError(output, target) {
        switch (this.lossFunction) {
            case 'mse':
                return output.map((val, i) => val - target[i]);
            default:
                return output.map((val, i) => val - target[i]);
        }
    }

    calculateGradients(error, activation) {
        const activationDerivative = this.applyActivationDerivative(activation);
        return error.map((err, i) => err * activationDerivative[i]);
    }

    calculateHiddenError(error, weights, activation) {
        const hiddenError = [];
        const activationDerivative = this.applyActivationDerivative(activation);
        
        for (let i = 0; i < activation.length; i++) {
            let sum = 0;
            for (let j = 0; j < error.length; j++) {
                sum += error[j] * weights[i][j];
            }
            hiddenError.push(sum * activationDerivative[i]);
        }
        
        return hiddenError;
    }

    updateWeights(layerIndex, prevActivation, gradients) {
        const weights = this.weights[layerIndex];
        
        for (let i = 0; i < weights.length; i++) {
            for (let j = 0; j < weights[i].length; j++) {
                weights[i][j] -= this.learningRate * gradients[j] * prevActivation[i];
            }
        }
    }

    updateBiases(layerIndex, gradients) {
        const biases = this.biases[layerIndex];
        
        for (let i = 0; i < biases.length; i++) {
            biases[i] -= this.learningRate * gradients[i];
        }
    }

    predict(input) {
        if (!this.isTrained) {
            throw new Error('Network must be trained before making predictions');
        }
        
        const activations = this.forwardPass(input);
        return activations[activations.length - 1];
    }

    getTrainingHistory() {
        return this.trainingHistory;
    }

    getNetworkInfo() {
        return {
            architecture: this.architecture,
            layers: this.layers.length,
            parameters: this.countParameters(),
            activationFunction: this.activationFunction,
            lossFunction: this.lossFunction,
            learningRate: this.learningRate,
            isTrained: this.isTrained
        };
    }

    countParameters() {
        let totalParams = 0;
        
        for (let i = 0; i < this.weights.length; i++) {
            totalParams += this.weights[i].length * this.weights[i][0].length;
            totalParams += this.biases[i].length;
        }
        
        return totalParams;
    }

    saveModel() {
        return {
            architecture: this.architecture,
            weights: this.weights,
            biases: this.biases,
            activationFunction: this.activationFunction,
            lossFunction: this.lossFunction,
            learningRate: this.learningRate,
            isTrained: this.isTrained,
            trainingHistory: this.trainingHistory
        };
    }

    loadModel(modelData) {
        this.architecture = modelData.architecture;
        this.weights = modelData.weights;
        this.biases = modelData.biases;
        this.activationFunction = modelData.activationFunction;
        this.lossFunction = modelData.lossFunction;
        this.learningRate = modelData.learningRate;
        this.isTrained = modelData.isTrained;
        this.trainingHistory = modelData.trainingHistory;
        
        // Rebuild layers
        this.buildNetwork();
    }
}

export default OptimizedNeuralNetwork;
